const fs = require('fs');
const loginFile = 'src/app/login/page.tsx';
const signupFile = 'src/app/signup/page.tsx';

let loginContent = fs.readFileSync(loginFile, 'utf8');

// Add useToast import to login
if (!loginContent.includes('useToast')) {
  loginContent = loginContent.replace(
    'import { createClient } from "@/utils/supabase/client";',
    'import { createClient } from "@/utils/supabase/client";\nimport { useToast } from "@/components/ui/ToastProvider";'
  );
}

// Add showToast to LoginForm
if (!loginContent.includes('const { showToast }')) {
  loginContent = loginContent.replace(
    'const supabase = createClient();',
    'const supabase = createClient();\n  const { showToast } = useToast();'
  );
}

// Add handleGoogleLogin
const googleLoginFn = `
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: \`\${window.location.origin}/auth/callback?redirect=\${encodeURIComponent(redirectUrl)}\`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      showToast({ type: "error", title: "GOOGLE LOGIN FAILED" });
    }
  };
`;
if (!loginContent.includes('handleGoogleLogin')) {
  loginContent = loginContent.replace(
    'const handleLogin = async',
    googleLoginFn + '\n  const handleLogin = async'
  );
}

// Add Google button and divider
const googleButtonHtml = `
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-[#ADACB5]/20"></div>
        <span className="px-3 text-[10px] font-black tracking-widest uppercase text-[#ADACB5]">OR</span>
        <div className="flex-1 border-t border-[#ADACB5]/20"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-[#1F2232] border-2 border-[#1F2232] text-[#D8D5DB] py-4 rounded-[20px] font-black tracking-widest uppercase hover:border-[#ADACB5]/30 active:scale-[0.98] transition-all flex justify-center items-center h-[56px] gap-3"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
`;

if (!loginContent.includes('Continue with Google')) {
  loginContent = loginContent.replace(
    '</form>',
    '</form>\n' + googleButtonHtml
  );
}

fs.writeFileSync(loginFile, loginContent);


let signupContent = fs.readFileSync(signupFile, 'utf8');

// Add useToast import to signup
if (!signupContent.includes('useToast')) {
  signupContent = signupContent.replace(
    'import { createClient } from "@/utils/supabase/client";',
    'import { createClient } from "@/utils/supabase/client";\nimport { useToast } from "@/components/ui/ToastProvider";'
  );
}

// Add showToast to SignupForm
if (!signupContent.includes('const { showToast }')) {
  signupContent = signupContent.replace(
    'const supabase = createClient();',
    'const supabase = createClient();\n  const { showToast } = useToast();'
  );
}

// Add handleGoogleLogin to signup
if (!signupContent.includes('handleGoogleLogin')) {
  signupContent = signupContent.replace(
    'const handleSignup = async',
    googleLoginFn + '\n  const handleSignup = async'
  );
}

if (!signupContent.includes('Continue with Google')) {
  signupContent = signupContent.replace(
    '</form>',
    '</form>\n' + googleButtonHtml
  );
}

fs.writeFileSync(signupFile, signupContent);
