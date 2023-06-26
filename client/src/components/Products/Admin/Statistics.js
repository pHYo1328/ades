import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';

export default function Statistics(props) {

    const { statistics } = props;

    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

    // const [statistics, setStatistics] = useState(null);




    return (
        <div>
            {/* shows the statistics */}
            {statistics ? (
                <div
                    className="row col-11 my-2 justify-content-center"
                    style={{ marginLeft: 'auto', marginRight: 'auto' }}
                >
                    <div className="col-3 text-center">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                                className="w-100 p-3 rounded"
                                style={{ background: '#dff7ec' }}
                            >
                                <h4 className="h4">Total Sold</h4>
                                <p>{statistics.total_sold}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 text-center">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                                className="w-100 p-3 rounded"
                                style={{ background: '#dfeaf7' }}
                            >
                                <h4 className="h4">Total Inventory</h4>
                                <p>{statistics.total_inventory}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 text-center">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                                className="w-100 p-3 rounded"
                                style={{ background: '#f0f7df' }}
                            >
                                <h4 className="h4">Total Revenue</h4>
                                <p>${statistics.total_payment}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 text-center">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                                className="w-100 p-3 rounded"
                                style={{ background: '#f3dff5' }}
                            >
                                <h4 className="h4">Total Order</h4>
                                <p>{statistics.total_order}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Loading component (full screen)
                <div className="flex items-center justify-center h-screen">
                    <Loading />
                </div>
            )}
        </div>
    )
}