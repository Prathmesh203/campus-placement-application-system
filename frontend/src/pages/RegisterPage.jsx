import React from 'react';
import { RegisterForm } from '../components/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container max-w-screen-xl py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Join SkillGate</h1>
          <p className="text-slate-500 mt-2">Create an account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
