import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

export const useMatchStore = create((set) => ({
	matches: [],
	isLoadingMyMatches: false,
	isLoadingUserProfiles: false,
	userProfiles: [],
	swipeFeedback: null,

	getMyMatches: async () => {
		try {
			set({ isLoadingMyMatches: true });
			const res = await axiosInstance.get("/matches");
			set({ matches: res.data.matches });
		} catch (error) {
			set({ matches: [] });
			toast.error(error.response.data.message || "Something went wrong");
		} finally {
			set({ isLoadingMyMatches: false });
		}
	},

	getUserProfiles: async () => {
		try {
			set({ isLoadingUserProfiles: true });
			const res = await axiosInstance.get("/matches/user-profiles");
			set({ userProfiles: res.data.users });
		} catch (error) {
			set({ userProfiles: [] });
			toast.error(error.response.data.message || "Something went wrong");
		} finally {
			set({ isLoadingUserProfiles: false });
		}
	},

	swipeLeft: async (user) => {
		try {
			set({ swipeFeedback: "passed" });
			await axiosInstance.post("/matches/swipe-left/" + user._id);
		} catch (error) {
			console.log(error);
			toast.error("Failed to swipe left");
		} finally {
			setTimeout(() => set({ swipeFeedback: null }), 1500);
		}
	},
	swipeRight: async (user) => {
		try {
			set({ swipeFeedback: "liked" });
			await axiosInstance.post("/matches/swipe-right/" + user._id);
		} catch (error) {
			console.log(error);
			toast.error("Failed to swipe right");
		} finally {
			setTimeout(() => set({ swipeFeedback: null }), 1500);
		}
	},

	subscribeToNewMatches: () => {
		try {
			const socket = getSocket();

			socket.on("newMatch", (newMatch) => {
				set((state) => ({
					matches: [...state.matches, newMatch],
				}));
				toast.success("You got a new match!");
			});
		} catch (error) {
			console.log(error);
		}
	},

	unsubscribeFromNewMatches: () => {
		try {
			const socket = getSocket();
			socket.off("newMatch");
		} catch (error) {
			console.error(error);
		}
	},
}));
