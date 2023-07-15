import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';
import RevenueChart from './RevenueChart';

export default function Statistics(props) {
  const { statistics } = props;

  return (
    <div>
      {/* shows the statistics */}
      {statistics ? (
        <div className="flex flex-wrap justify-center my-2 mx-auto max-w-4xl text-center">
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-2">
            <div className="h-full rounded bg-green-100 p-3">
              <h4 className="text-lg font-bold mb-2">Total Sold</h4>
              <h5 className="text-lg pt-2">{statistics.total_sold}</h5>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-2">
            <div className="h-full rounded bg-blue-100 p-3">
              <h4 className="text-lg font-bold mb-2">Total Inventory</h4>
              <h5 className="text-lg pt-2">{statistics.total_inventory}</h5>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-2">
            <div className="h-full rounded bg-yellow-100 p-3">
              <h4 className="text-xl font-bold mb-2">Total Revenue</h4>
              <h5 className="text-lg pt-2">${statistics.total_payment}</h5>
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-2">
            <div className="h-full rounded bg-purple-100 p-3">
              <h4 className="text-lg font-bold mb-2">Total Order</h4>
              <h5 className="text-lg pt-2">{statistics.total_order}</h5>
            </div>
          </div>
        </div>
      ) : (
        // Loading component (full screen)
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )}
      {/* <RevenueChart /> */}
    </div>
  );
}
