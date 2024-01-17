import react, {useState} from 'react';
import Input from '../UI/Input';




const UserProfile = () => {

    interface FormData {
        name: string;
        email: string;
        phone:  string;
        languages: string[];
    }
    
    const [formData, setFormData] = React.useState<FormData>({
        name: "",
        email: "",
        phone: "",
        languages: [],
    });


    return (

        <div className="w-full ">

            <div>
                <div>
                    <img src="./assets/img/mke.png" />
                    <span>Upload Photo</span>
                </div>
                <form>
                    <Input name ="name" type="text" label="Full name" placeholder="Enter your full name" id="name" value='' />
                </form>
            </div>
        
        </div>    
    )
        
    
    
    
}

export default UserProfile;