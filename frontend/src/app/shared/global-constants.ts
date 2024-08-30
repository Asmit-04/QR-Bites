export class GlobalConstants{
    // meassage
  public static genericError:string = "Something Went Wrong. Please try again later.";

  public static unauthorized:string = "You are not authorized person to access this page.";

  public static productExistError:string = "product already exist.";

  public static productAdded:string = "Product Added Successfully.";

//   regex
// public static nameRegex:string  = "[a-zA-Z0-9 ]*";
public static nameRegex: string = "^[a-zA-Z0-9][a-zA-Z0-9 ]*$";


public static emailRegex:string  = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

public static contactNumberRegex:string  = "^[e0-9]{10,10}$";

public static priceRegex: string = "^[0-9]*$"; // Pattern for only numbers

//variable
public static error:string="error";

public static readonly success: string = 'success';

}