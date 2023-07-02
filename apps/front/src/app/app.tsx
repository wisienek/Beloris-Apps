import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import PackageEditorStateContextProvider from "./components/package-editor/sections/package-editor.state";
import OuterLayerDrawer from "./components/drawer-menu/sections/outer-layer-drawer";
import { ErrorBox } from "./components/combined/error-box";
import { DownloaderProvider } from "./components/context";
import PackageEditorPage from "./pages/package-editor";
import SettingsPage from "./pages/settings-page";
import MainPage from "./pages/main-page";
import { useLogin } from "./hooks";

export const App = () => {
	const { login } = useLogin();

	useEffect(() => {
		login();
	}, []);

	return (
		<DownloaderProvider>
			<ErrorBox />
			<OuterLayerDrawer>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="/mods-wizard" element={<PackageEditorStateContextProvider>
						<PackageEditorPage />
					</PackageEditorStateContextProvider>} />
				</Routes>
			</OuterLayerDrawer>
		</DownloaderProvider>
	);
};

export default App;
