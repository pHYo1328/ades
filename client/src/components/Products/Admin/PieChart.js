import React from 'react';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Pie } from 'react-chartjs-2'; // Import Pie instead of Bar

export default function PieChart({ labels, counts, backgroundColor, color, title, legend }) {
    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        ArcElement
    );

    const options = {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: { legend },
                data: counts,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(255, 255, 255, 1.0)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={`${color} rounded-lg p-5 w-100`}>
            <h4 className="text-2xl font-bold mb-6 text-center">{title}</h4>
            <Pie options={options} data={data} />
        </div>
    );
}
