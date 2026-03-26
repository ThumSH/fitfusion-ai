import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-4 py-14">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </section>
  );
}
