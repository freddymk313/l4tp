import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

interface ModelDetailsDialogProps {
  model: any;
  idx: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelDetailsDialog({
  model,
  idx,
  isOpen,
  onClose,
}: ModelDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full md:min-w-[52%] md:mt-4 text-foreground p-4 md:p-6">
        <ScrollArea className="max-h-[80vh] md:max-h-[60vh] md:min-w-[70%] overflow-auto rounded-md border dark:border-gray-400">
          <Image
            src={model.image}
            alt={model.name}
            height={950}
            width={950}
            className="w-full h-full object-cover rounded-md transition-opacity duration-300 group-hover:opacity-40"
          />
        </ScrollArea>

        <DialogFooter>
          <DialogTitle>
            <div className="">
              {/* <div className="h-5 w-5 rounded-md border flex items-center justify-center">
                        <Heart className="h-4 w-4" />
                    </div> */}

              <Link href={`/creer-cv?selected=${idx}`} passHref>
                <Button size={"xl"}>Utiliser</Button>
              </Link>
            </div>
          </DialogTitle>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
