const chalk = require("chalk");
const paymentServices = require("../services/payment.services");

//Get payment by ID
exports.processGetPaymentByID = async (req, res, next) => {
    console.log(chalk.blue("processGetPaymentByID running"));
  
    const { paymentID } = req.params;
  
    try {
     if(isNaN(parseInt(paymentID))){
        const error = new Error("invalid paymentID")
        error.status = 400
        throw error
     }
      const paymentData = await paymentServices.getPaymentByID(paymentID);
      if(paymentData.length == 0){
        const error = new Error("No payment exists")
        error.status = 404
        throw error
      }
      if (paymentData) {
        console.log(chalk.yellow("Payment data: ", paymentData));
       
        return res.status(200).json({
          statusCode: 200,
          ok: true,
          message: "Read payment details successful",
          paymentData,
        });
      }
   
      
    } catch (error) {
      
      console.error(chalk.red("Error in getPaymentByID: ", error));
      return next(error);
    }
  };

//get all payment which haven't done delivery

exports.processGetListsByDeliStatus = async (req, res, next) => {
    console.log(chalk.blue("processGetListsByDeliStatus running"));
  
    try {
      const deliveryData = await paymentServices.getListsByDeliStatus();
   
      if (deliveryData) {
        console.log(chalk.yellow("Payment data: ", deliveryData));
       
        return res.status(200).json({
          statusCode: 200,
          ok: true,
          message: "orders haven't started the delivery yet",
          deliveryData,
        });
      }
   
      
    } catch (error) {
      
      console.error(chalk.red("Error in getPaymentByID: ", error));
      return next(error);
    }
  };

//updating delivery_status

// exports.processUpdateDeliByID = async (req, res, next) => {
//     console.log(chalk.blue("processUpdateDeliByID running"));
//     const { orderID } = req.params;
//     const{delivery_status} = req.body;
  
//     try {
//         if(isNaN(parseInt(orderID))){
//             const error = new Error("invalid orderID")
//             error.status = 400
//             throw error
//          }
//       const updateDeliveryStatus = await paymentServices.updateDeliByID(
//         delivery_status,
//         orderID
//       );
   
//       if(updateDeliveryStatus.length == 0){
//         const error = new Error("No order exists")
//         error.status = 404
//         throw error
//       }
//       if (updateDeliveryStatus) {
//         console.log(chalk.yellow("Delivery data: ", updateDeliveryStatus));
       
//         return res.status(200).json({
//           statusCode: 200,
//           ok: true,
//           message: "Update delivery status successful",
//           updateDeliveryStatus,
//         });
//       }
   
      
//     } catch (error) {
      
//       console.error(chalk.red("Error in updateDeliByID: ", error));
//       return next(error);
//     }
//   };

  




