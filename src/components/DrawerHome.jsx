import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"
import { FiAlignJustify } from "react-icons/fi";

export default function DrawerHome() {
    return (
        <Drawer.Root>
        <Drawer.Trigger asChild>
            <Button variant="outline" size="sm">
                <FiAlignJustify/>
            </Button>
        </Drawer.Trigger>
        <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
            <Drawer.Content>
                <Drawer.Body>
                    <Button w="100%" mb={2} variant="ghost">
                        Ver Cardápio
                    </Button>
                    <Button w="100%" mb={2} variant="ghost">
                        Login
                    </Button>
                </Drawer.Body>
                <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
                </Drawer.CloseTrigger>
            </Drawer.Content>
            </Drawer.Positioner>
        </Portal>
        </Drawer.Root>
  )
}