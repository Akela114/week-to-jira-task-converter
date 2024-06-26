import { useEffect, useState, type FC, type ReactNode } from "react";
import { ToastContainer } from "react-toastify";

type ToastContainerProviderProps = {
	children: ReactNode;
};

export const ToastContainerProvider: FC<ToastContainerProviderProps> = ({
	children,
}) => {
	const [shouldChildrenRender, setShouldChildrenRender] = useState(false);

	useEffect(() => {
		setShouldChildrenRender(true);
	}, []);

	return (
		<>
			<ToastContainer />
			{shouldChildrenRender && children}
		</>
	);
};
