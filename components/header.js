import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaDiscord } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";

const links = [
  {
    name: "Discord",
    url: "https://discord.gg/5RxKe49QSC",
    icon: <FaDiscord className="text-md" />,
  },
  {
    name: "Document",
    url: "https://converse.gitbook.io/c/~/changes/6H0aEeafHF1SV4BaCXak?r=LrligjJLsrpqidXAY78Z",
    icon: <IoDocument className="text-md" />,
  },
];

export default function Header() {
  return (
    <header>
      <div className="header pixel-shadow">
        <h1>Gundi</h1>
        <div className="user">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="user-icon">
              <GiHamburgerMenu className="text-lg my-auto" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="mt-3 user-dropdown cursor-pointer bg-[var(--cream)] px-1 py-2 rounded-lg pixel-shadow border-2 border-[var(--black)]">
                {links.map((link, index) => (
                  <DropdownMenu.Item className="user-dropdown-item" key={index}>
                    <a href={link.url} className="flex gap-x-1.5 hover:text-[var(--cream)] hover:bg-[var(--accent)] rounded-lg p-1.5 px-2.5 text-[var(--black)]">
                      {link.icon}
                      <p className="text-xs pt-[0.1rem]">{link.name}</p>
                    </a>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
