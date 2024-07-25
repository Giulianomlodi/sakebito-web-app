import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function BurgerMenu() {
    return (
        <div className="burger-menu">
            <Menu>
                {({ isOpen }) => (
                    <>
                        <MenuButton
                            isActive={isOpen}
                            as={IconButton}
                            icon={<GiHamburgerMenu />}
                            variant="outline"
                            aria-label="Options"
                            colorScheme="black"
                            color="white" // Set the color to white
                        ></MenuButton>
                        <MenuList>
                            <MenuItem>
                                <Link href="https://www.sakebito.xyz/">Home</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link href="/">Mint</Link>
                            </MenuItem>
                        </MenuList>
                    </>
                )}
            </Menu>
        </div>
    );
}
