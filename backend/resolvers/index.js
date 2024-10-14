import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./user.resolver.js";
import transactionResolvers from "./transaction.resolver.js";

const mergedResolvers = mergeResolvers([userResolvers, transactionResolvers]);

export default mergedResolvers;