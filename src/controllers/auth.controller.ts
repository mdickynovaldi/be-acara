import { Request, Response } from "express";
import * as Yup from "yup";


type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const registerValidateSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), ""], "Password not match"),
  });

export default {
    register: async (req: Request, res: Response) => {
        // Check if request body exists
        if (!req.body) {
            return res.status(400).json({
                message: "Request body is required",
                data: null,
            });
        }

        const { fullName, username, email, password, confirmPassword } = req.body as TRegister;

        try {
            await registerValidateSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword,
              });
            return res.status(200).json({
                message: "Register success",
                data: {
                    fullName,
                    username,
                    email,
                    password,
                    confirmPassword,
                }
                
            }); 
        } catch (error) {
            
            return res.status(400).json({
                message: (error as Error).message,
                data: null,
            });
        }
        
    }
}