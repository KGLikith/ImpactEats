type UserRegistrationProps = {
  id: string;
  type: "email" | "text" | "password" | "number";
  inputType: "select" | "input";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
};

export  const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};


export const USER_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Full name",
    name: "fullname",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "3",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
  {
    id: "4",
    inputType: "input",
    placeholder: "Confrim Password",
    name: "confirmPassword",
    type: "password",
  },
];

export const USER_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const USER_FORGOT_PASSWORD_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
  },
];

export const DONATION_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Food Type",
    name: "foodType",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Description",
    name: "description",
    type: "text",
  },
  {
    id: "3",
    inputType: "input",
    placeholder: "Image URL",
    name: "imageUrl",
    type: "text",
  },
  {
    id: "4",
    inputType: "input",
    placeholder: "Address",
    name: "address",
    type: "text",
  },
  {
    id: "5",
    inputType: "input",
    placeholder: "Additional Delivery Note",
    name: "additionDeliveryNote",
    type: "text",
  },
  {
    id: "6",
    inputType: "input",
    placeholder: "Quantity",
    name: "quantity",
    type: "number",
  },
  {
    id: "7",
    inputType: "input",
    placeholder: "Quantity Unit",
    name: "quantityUnit",
    type: "text",
  },
  {
    id: "8",
    inputType: "input",
    placeholder: "Name",
    name: "name",
    type: "text",
  },
  {
    id: "9",
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "10",
    inputType: "input",
    placeholder: "Phone",
    name: "phone",
    type: "text",
  },
  {
    id: "11",
    inputType: "input",
    placeholder: "Available Date",
    name: "availableDate",
    type: "text",
  },
  {
    id: "12",
    inputType: "input",
    placeholder: "Available Time",
    name: "availableTime",
    type: "text",
  },
  {
    id: "13",
    inputType: "input",
    placeholder: "Expiry Date",
    name: "expiryDate",
    type: "text",
  },
  {
    id: "14",
    inputType: "input",
    placeholder: "Expiry Time",
    name: "expiryTime",
    type: "text",
  },
  {
    id: "15",
    inputType: "select",
    placeholder: "Delivery Option",
    name: "deliveryOption",
    type: "text",
    options: [
      { value: "pickup", label: "Pickup", id: "pickup" },
      { value: "self-delivery", label: "Self Delivery", id: "self-delivery" },
    ],
  },
];
