import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Achievement } from "./game/logic/PlayerAchievement";
import { EventBus } from "./game/EventBus";

function ToastNotifications() {
    useEffect(() => {
        // Take the achievement event to auto-mint the badge once the achievement is unlocked

        const handleAchievement = (achievements: Achievement) => {
            console.log(achievements.badge);
            toast(
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={achievements.badge} // Adjust the path to your image
                        style={{
                            width: "50px",
                            height: "50px",
                            marginRight: "10px",
                        }}
                    />
                    <strong>
                        Achievement Unlocked: {achievements.name} &nbsp;
                    </strong>
                    <p> "{achievements.description}"</p>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    style: { width: "500px" },
                }
            );
        };

        EventBus.on("achievementUnlocked", handleAchievement);

        return () => {
            EventBus.off("achievementUnlocked", handleAchievement);
        };
    }, []);

    return <ToastContainer />;
}

export default ToastNotifications;
