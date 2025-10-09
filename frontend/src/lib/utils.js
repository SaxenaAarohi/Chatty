export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function formChatDate(date){
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate()-1);

  const isToday = d.toDateString() === today.toDateString();
  const isyesterday = d.toDateString() === yesterday.toDateString();
  
  if(isToday) return "Today";
  if(isyesterday) return "Yesterday";

  return d.toLocaleDateString("en-US",{
    year : "numeric",
    month : "short",
    day : "numeric",
  });
}