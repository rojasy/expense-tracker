import Transaction from "../models/transaction.model.js";

const transactionResolvers = {
    Query:{
        transactions:async(_,__,context)=>{
            try {
                if(!context.getUser()){
                    throw new Error("Unauthorized");
                }

                const userId = await context.getUser()._id;

                const transactions = await Transaction.find({userId:userId});
                return transactions;
                
            } catch (err) {
                console.log("Error in transactions query", err);
                throw new Error("Error getting transactions");
            }
        },
        transaction:async(_,{transactionId})=>{
            try {

                const transaction = await Transaction.findById(transactionId);
                return transaction;
                
            } catch (err) {
                console.log("Error in transaction query", err);
                throw new Error("Error getting transaction");
            }
        }
    },
    Mutation:{
        createTransaction:async(_,{input},context)=>{
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                console.log("Error in creating transaction mutation", err);
                throw new Error("Error creating transaction");
            }
        },
        updateTransaction:async(_,{input},context)=>{
            try {

                const updatedTransaction = await Transaction.findOneAndUpdate(
                    {_id:input.transactionId},
                    input,
                    {new:true}
                );
                return updatedTransaction;
                
            } catch (err) {
                console.log("Error in updating transaction mutation", err);
                throw new Error("Error updating transaction");
            }
        },
        deleteTransaction:async(_,{transactionId})=>{
            try {

                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
                
            } catch (err) {
                console.log("Error in deleting transaction mutation", err);
                throw new Error("Error deleting transaction");
            }
        },
    },
};

export default transactionResolvers;