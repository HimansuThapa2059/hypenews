import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-primary backdrop-blur supports-backdrop-filter:bg-primary/90">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold">
            HypeNews
          </Link>
          <nav className="hidden items-center space-x-4 md:flex ml-5">
            <Link
              to={"/"}
              search={{ sortBy: "recent", order: "desc" }}
              className="hover:underline"
            >
              new
            </Link>
            <Link
              className="hover:underline"
              to={"/"}
              search={{ sortBy: "points", order: "desc" }}
            >
              top
            </Link>
            <Link to="/" className="hover:underline">
              submit
            </Link>
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="md:hidden cursor-pointer"
            >
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-64 p-6 bg-white dark:bg-gray-900 shadow-xl">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                HypeNews
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigation
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                search={{ sortBy: "recent", order: "desc" }}
                className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                New
              </Link>
              <Link
                to="/"
                search={{ sortBy: "points", order: "desc" }}
                className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Top
              </Link>
              <Link
                to="/"
                className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Submit
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
