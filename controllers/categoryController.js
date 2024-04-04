import categoryModel from "../models/categoryModel.js";

export async function createCategoryController(req, res) {
    try {
        // console.log("HEre we are");
        if (!req.body.name) {
            return res.send({ error: "Name of category is required" });
        }
        
        let inputString = req.body.name;
        let newStr = inputString.trim().replace(/\s+/g, "-");

        const match = await categoryModel.findOne({ name: newStr });
        if (match) {
            return res.send({ error: "Category alreay exist" });
        }

        let result = await categoryModel.create({ name: newStr });

        if (result) {
            
            return res.send({
                success: true,
                message: "Category is created successfully",
                result
            })
        }
        else{
            return res.send({
                success: false,
                error: "Error in query but not the server error"});
        }
    }
    catch (err) {
        console.log(err);
        return res.send({
            success: false,
            error: "Internal server error in creating the category"
        });
    }
}

export async function updateCategoryController(req, res) {
    try {
        
        let inputString = req.body.name;
        let newStr = inputString.trim().replace(/\s+/g, "-");
        let result = await categoryModel.updateOne({ _id: req.params.id }, { $set: { name: newStr } });

        if (result) {
            return res.send({
                success: true,
                message: 'Updated successfully',
                result
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error",
            })
        }
    }
    catch (err) {
        
        return res.send({
            succes: false,
            error: "Internal server error in updating the category"
        })
    }
}

export async function deleteCategoryController(req, res){
    try{
        console.log(req.params.id);
        let result = await categoryModel.deleteOne({_id: req.params.id});

        if(result){
            return res.send({
                success: true, 
                message: "Category deleted successfully"
            });
        }
        else{
            return res.send({
                success: false,
                error: "Error in query but not the server error"});
        }
    }
    catch(err){
        
        return res.send({
            error: "Internal server error in deleting category"
        })
    }
}

export async function getAllCategoryController(req, res) {
    try {
        let result = await categoryModel.find({});
        if (result) {
            return res.send({
                success: true,
                message: "All categories are here",
                result
            })
        }
        else{
            return res.send({
                success: false,
                error: "No category available"});
        }
    }
    catch (err) {
        
        return res.send({ error: "Internal server error in getting all category" });
    }
}

export async function getOneCategoryController(req, res) {
    try {
        
        let inputString = req.params.name;
        let newStr = inputString.trim().replace(/\s+/g, "-");
        
        let result = await categoryModel.findOne({name: newStr});
        if(result){
            return res.send({
                success: true,
                
                result
            })
        }
        else{
            return res.send({
                success: false,
                error: "No category as per given data"});
        }
    }
    catch (err) {
        console.log(err);
        return res.send({
            success: false,
            error: "Internal server error in getting particular category"
        })
    }
}