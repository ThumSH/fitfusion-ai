import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-4 py-14">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </section>
  );
}
