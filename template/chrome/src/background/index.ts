import { MessageCenter } from "@/utilties/message/center";
import { migrate } from "@/utilties/db/migrate";

migrate();

const center = new MessageCenter();
center.start();
