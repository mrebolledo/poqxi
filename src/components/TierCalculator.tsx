import {LayerManager} from "./LayerManager.tsx";
import TotalPanel from "./TotalPanel.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {type Layer, PlanContext} from "../App.tsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type TierCalculatorProps = {
    initialLayers: Layer[];
}

function TierCalculator({initialLayers} : TierCalculatorProps) {
    const { length, width, unit, ratio, reset, pdftrigger } = useContext(PlanContext);
    const [layers, setLayers] = useState<Layer[]>(initialLayers);
    const [totals, setTotals] = useState({ resine: 0, varnish: 0, cost: 0 });

    useEffect(() => {
        setLayers(initialLayers);
    }, [reset]);

    const generatePDF = () => {
        const doc = new jsPDF();
        const areaInM2 = unit === 'cm' ? (length * width) / 10000 : (length * width);
        const date = new Date().toLocaleDateString();

        // --- ENCABEZADO ---
        doc.setFontSize(22);
        doc.setTextColor(15, 118, 110); // Cyan 700
        doc.text("Plan de Aplicación de Resina", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Fecha: ${date}`, 14, 30);
        doc.text(`Proyecto: ${length}${unit} x ${width}${unit} (Área: ${areaInM2.toFixed(2)} m²)`, 14, 36);
        doc.text(`Relación de Mezcla Base: ${ratio}`, 14, 42);

        const [partA, partB] = ratio.split(':').map(Number);
        const totalParts = partA + partB;

        // --- PREPARACIÓN DE DATOS PARA LA TABLA ---
        const tableRows: any[] = [];
        let totalResinWeight = 0;

        layers.forEach((layer) => {
            const layerWeight = areaInM2 * layer.thickness * layer.consumptionPerM2PerMm;
            const weightA = (layerWeight * partA) / totalParts;
            const weightB = (layerWeight * partB) / totalParts;

            if (layer.type === 'resin') totalResinWeight += layerWeight;

            const format = (g: number) => g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${g.toFixed(0)} g`;

            // Fila principal de la capa
            tableRows.push([
                { content: layer.name, styles: { fontStyle: 'bold', fillColor: [240, 253, 250] } },
                { content: layer.type === 'resin' ? 'Resina' : 'Varnish', styles: { fillColor: [240, 253, 250], fontSize: 8 } },
                { content: layer.type === 'resin' ? `${layer.thickness} mm` : `${layer.thickness} cap`, styles: { fillColor: [240, 253, 250], halign: 'center' } },
                { content: layer.type === 'resin' ? format(weightA) : '-', styles: { fillColor: [240, 253, 250] } },
                { content: layer.type === 'resin' ? format(weightB) : '-', styles: { fillColor: [240, 253, 250] } },
                { content: format(layerWeight), styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 253, 250] } }
            ]);

            // Desglose de Colores
            if (layer.type === 'resin' && layer.colors && layer.colors.length > 0) {
                layer.colors.forEach(color => {
                    const colorTotal = (layerWeight * color.percentage) / 100;
                    const colorA = (colorTotal * partA) / totalParts;
                    const colorB = (colorTotal * partB) / totalParts;

                    tableRows.push([
                        { content: `   • ${color.name} (${color.percentage}%)`, styles: { textColor: [100], fontSize: 8 } },
                        { content: "", styles: { fillColor: [255, 255, 255] } }, // Tipo vacío para colores
                        { content: "", styles: { fillColor: [255, 255, 255] } }, // Espesor vacío para colores
                        { content: format(colorA), styles: { textColor: [100], fontSize: 8 } },
                        { content: format(colorB), styles: { textColor: [100], fontSize: 8 } },
                        { content: format(colorTotal), styles: { halign: 'right', textColor: [100], fontSize: 8 } }
                    ]);
                });
            }
        });

        // --- GENERAR TABLA ---
        autoTable(doc, {
            startY: 50,
            head: [['Capa / Mezcla', 'Tipo', 'Esp.', `A (${partA})`, `B (${partB})`, 'Total']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [15, 118, 110], halign: 'center', fontSize: 9 },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 25, halign: 'center' },
                5: { cellWidth: 25, halign: 'right' }
            }
        });
        // --- RESUMEN FINAL ---
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Resumen Total de Materiales:", 14, finalY);

        doc.setFontSize(11);
        doc.text(`- Resina Total: ${(totalResinWeight / 1000).toFixed(2)} kg`, 14, finalY + 8);
        doc.text(`- Componente A: ${((totalResinWeight * parseInt(ratio.split(':')[0])) / (parseInt(ratio.split(':')[0]) + parseInt(ratio.split(':')[1])) / 1000).toFixed(2)} kg`, 14, finalY + 14);
        doc.text(`- Componente B: ${((totalResinWeight * parseInt(ratio.split(':')[1])) / (parseInt(ratio.split(':')[0]) + parseInt(ratio.split(':')[1])) / 1000).toFixed(2)} kg`, 14, finalY + 20);

        doc.save(`Presupuesto_${date.replace(/\//g, '-')}.pdf`);
    };

    const lastProcessedTrigger = useRef<number | null>(null);

    useEffect(() => {
        // 1. Si el trigger es null (inicio), no hacemos nada
        if (!pdftrigger) return;

        // 2. Si el ID del trigger es el mismo que ya procesamos, lo ignoramos
        // Esto evita que se descargue al navegar de regreso a esta pestaña
        if (pdftrigger === lastProcessedTrigger.current) return;

        // 3. Si llegamos aquí, es un nuevo click real
        generatePDF();

        // 4. Marcamos este ID como procesado
        lastProcessedTrigger.current = pdftrigger;

    }, [pdftrigger]);

    useEffect(() => {
        const areaInM2 = unit === 'cm' ? (length * width) / 10000 : (length * width);

        const summary = layers.reduce((acc, layer) => {
            const grams = areaInM2 * layer.thickness * layer.consumptionPerM2PerMm;

            if (layer.type === 'resin') acc.resine += grams;
            if (layer.type === 'varnish') acc.varnish += grams;

            // Supongamos precios base: Resina $45/kg, Barniz $80/kg
            const price = layer.type === 'resin' ? 45 : 80;
            acc.cost += (grams / 1000) * price;

            return acc;
        }, { resine: 0, varnish: 0, cost: 0 });

        setTotals(summary);
    }, [length, width, unit, layers]);

    return (
        <>
            <div className="py-4">
                <LayerManager layers={layers} onLayersChange={setLayers} />
                <TotalPanel totalResine={totals.resine} />
            </div>
        </>
    );
}

export default TierCalculator;