import { Toaster } from "react-hot-toast";

export const ToastWrapper = () => {
	return (
		<Toaster
			position='top-right'
			gutter={12}
			containerClassName="font-sans"
			toastOptions={{
				duration: 3000,
				style: {
					background: 'var(--background)',
					color: 'var(--foreground)',
					border: '1px solid var(--border)',
					borderRadius: 'var(--radius)',
					boxShadow: 'var(--shadow-md)',
				},
				success: {
					duration: 2000,
					iconTheme: {
						primary: 'var(--primary)',
						secondary: 'var(--primary-foreground)',
					}
				},
				error: {
					duration: 4000,
					iconTheme: {
						primary: 'var(--destructive)',
						secondary: 'var(--foreground)',
					}
				}
			}}
		/>
	);
};