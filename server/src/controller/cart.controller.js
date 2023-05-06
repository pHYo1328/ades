const cartManagement= require("../services/cart.services");
const chalk= require("chalk")

exports.processAddCartData= async (req,res,next)=>{
    console.log(chalk.blue("processAddCartData is running"));
    const {userID}=req.param;
    const {cartData}= req.body;
    try{
        const result= await cartManagement.addCartData(userID,cartData);
        console.log(chalk.yellow("Inspect result variable from addCartData service\n"),result);
        if(result){
            return res.status(200).send({
                statusCode: 200,
                ok : true,
                message : "cartData added successfully.",
                data : "",
            })
        }
    }
    catch (error){
        return next(error);
    }
};