import { Query } from "mongoose";

const userResolvers = {
    Mutation: {
        signUp: async(_, {input},context) => {
            try {
                const {username, name, password, gender} = input;

                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required");
                }

                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error("User already exists");
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // https://avatar-placeholder.iran.liara.run/
                const boyProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;
                
            } catch (err) {
                console.log("Error in signUp mutation", err);
                throw new Error(err.message || "Internal server error");
            }
        },

        login: async(_, {input}, context) => {
            try {

                const {username, password} = input;
                if(!username || !password){
                    throw new Error("All fields are required");
                }
                const {user} = await context.authenticate(username, password);

                await login(user);
                return user;
                
            } catch (err) {
                console.log("Error in login mutation", err);
                throw new Error(err.message || "Internal server error");
            }
        },

        logout:async(_,__,context) => {

            await context.logout();

            req.session.destroy((err)=>{
                if(err){
                    console.log(err);
                    throw err
                }
            });

            res.clearCookie("connect.sid");
            return {message:"Logged out successful"}
            
        }
    },
    Query: {
        authUser: async(_,__,context) => {
            try {

                const user = await context.getUser();
                return user;
                
            } catch (err) {
                console.log("Error in authUser query", err);
                throw new Error(err.message || "Internal server error");
            }
        },
        user:async(_,{userId})=>{
            try {

                const user = await User.findById(userId);
                return user;
                
            } catch (err) {
                console.log("Error in user query", err);
                throw new Error(err.message || "Internal server error");
            }
        }
    },

    
};

export default userResolvers;