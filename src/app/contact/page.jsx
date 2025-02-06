import ContactForm from "@/app/components/contact";
import RootLayout from "../layout";

export default function Contact({ children }) {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <div className="w-full max-w-3xl ">
          <ContactForm />
        </div>
      </div>
  );
}
