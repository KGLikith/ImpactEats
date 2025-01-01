export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
};

export const sendEmail = (email: string) => {
  window.location.href = `mailto:${email}`;
};

export const callPhone = (phone: string) => {
  window.location.href = `tel:${phone}`;
};

export const getBackgroundColor = (status?: string) => {
  switch (status) {
    case "CLAIMED":
      return "bg-yellow-50";
    case "ASSIGNED":
      return "bg-blue-50";
    case "RECIEVED":
      return "bg-green-50";
    case "CANCELLED":
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
};