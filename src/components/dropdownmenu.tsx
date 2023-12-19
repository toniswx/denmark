'use client'
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    
  } from "lucide-react"
  import { TriangleDownIcon } from '@radix-ui/react-icons'
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
   import userStore from "../../store/user"
  export function DropdownMenuDemo() {



    const userData = userStore((state) => state.user)
    const teamIndex = userStore((state) => state.currentTeamIndex)
    const setIndex = userStore((state) => state.setCurrentTeamIndex)



    const currentTeam = userData?.teams[teamIndex]
 

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full" asChild>
          <Button variant="outline" className="p-2 w-full flex items-center pl-5 justify-start">{currentTeam?.teamName} < TriangleDownIcon className="ml-2" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">


          <DropdownMenuLabel>Your teams </DropdownMenuLabel>
          
          <DropdownMenuGroup>

          {userData?.teams.map((team,_index) =>{
              return  <DropdownMenuItem className="w-full" onClick={()=>{
                setIndex(_index)
              }}>
              <User className="mr-2 h-4 w-4" />
              <span>{team.teamName}</span>
              <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
            </DropdownMenuItem>
            })}
          </DropdownMenuGroup>
         
          <DropdownMenuSeparator />
        
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Create new team</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
         
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }