import { useChat } from "@/hooks/use-chat";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ArrowLeft, PenBoxIcon, Search, UserIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";

const NewChatPopover = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isGroupMode, setIsGroupMode] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const { fetchAllUsers, users, isUsersLoading, createChat, isCreatingChat } =
    useChat();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const resetState = () => {
    setIsGroupMode(false);
    setGroupName("");
    setSelectedUsers([]);
  };

  const handleBack = () => {
    resetState();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(false);
    resetState();
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    await createChat({
      isGroup: true,
      participants: selectedUsers,
      groupName,
    });

    setIsOpen(false);
    resetState();
  };

  const handleCreateChat = async (userId: string) => {
    setLoadingUserId(userId);

    try {
      await createChat({
        isGroup: false,
        participantId: userId,
      });

      setIsOpen(false);
      resetState();
    } finally {
      setLoadingUserId(null);
      setIsOpen(false);
      resetState();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="icon"
          className="w-8 h-8"
        >
          <PenBoxIcon className="h-5! w-5! stroke-1!" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 z-[999px] p-0 rounded-xl min-h-100 max-h-[80vh] flex flex-col"
      >
        <div className="border-b p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {isGroupMode && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft size={16} />
              </Button>
            )}
            <h3 className="text-lg font-semibold">
              {isGroupMode ? "New Group" : "New Chat"}
            </h3>
          </div>
          <InputGroup>
            <InputGroupInput
              placeholder={isGroupMode ? "Enter group name" : "Search name"}
              value={isGroupMode ? groupName : ""}
              onChange={
                isGroupMode ? (e) => setGroupName(e.target.value) : undefined
              }
            />
            <InputGroupAddon>
              {isGroupMode ? <UserIcon /> : <Search />}
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex-1 justify-center overflow-y-auto p-1 space-y-1">
          {isUsersLoading ? (
            <Spinner className="w-6 h-6" />
          ) : users && users.length === 0 ? (
            <div className="text-center text-muted-foreground">No users</div>
          ) : isGroupMode ? (
            <></>
          ) : (
            <></>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NewChatPopover;
