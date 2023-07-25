import React from 'react';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2'; // Import Doughnut instead of Pie

export default function DoughnutChart({ labels, counts, backgroundColor, color, title, legend }) {
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
                label: legend,
                data: counts,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(255, 255, 255, 1.0)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={`${color} rounded-lg p-5 w-25 lg:w-25 md:w-50 sm:w-100`}>
            <h4 className="text-2xl font-bold mb-6 text-center">{title}</h4>
            <Doughnut options={options} data={data} />
        </div>
    );
}
