const { ref } = require("joi");
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{
     type:String,
    

    },
     description:{
     type:String,
   

    },
     image: {
  filename: { type: String, default: "" },
  url: {
    type: String,

  }
},

  
     price:{
     type:Number,
    

    },

     location:{
     type:String,
  

    },

     country:{
     type:String,
     },
reviews: [
  {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
],
    
owner:{
type:Schema.Types.ObjectId,
ref:"User"
}
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
