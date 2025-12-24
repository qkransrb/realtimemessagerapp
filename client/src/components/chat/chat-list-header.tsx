import type { Dispatch, SetStateAction } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import NewChatPopover from "./new-chat-popover";

interface Props {
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const ChatListHeader = ({ setSearchQuery }: Props) => {
  return (
    <div className="p-3 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Chat</h1>
        <div>
          <NewChatPopover />
        </div>
      </div>
      <div>
        <InputGroup className="bg-background text-sm">
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatListHeader;
