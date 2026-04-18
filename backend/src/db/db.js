const mongoose = require("mongoose");

const connectDb = async () => {
     try {
          return await mongoose.connect("mongodb+srv://prathmeshch2003:BA55KNPp9IZ3euOS@cluster0.gjc6k9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/campusHiring")
     } catch (error) {
          throw error
     }
}

module.exports = connectDb;