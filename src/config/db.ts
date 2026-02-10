import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env";

export const connectDb = async (): Promise<void> => {
	if (env.dnsServers.length > 0) {
		dns.setServers(env.dnsServers);
	}
	await mongoose.connect(env.mongoUri);
};
