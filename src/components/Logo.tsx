
import darkLogo from "@/assets/dark-logo.png";

export const Logo = () => {

    return (
        <>
            {/* Logo Overlay */}
            <div className="absolute top-0">
                 <img src={darkLogo} alt={"logo"}/>
            </div>
        </>
    );
};