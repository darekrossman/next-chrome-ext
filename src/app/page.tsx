import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AI Assistant Chrome Extension</CardTitle>
          <CardDescription>Your AI assistant powered by Next.js and Tailwind v4</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Access the AI assistant through the Chrome side panel by clicking on the extension icon.
          </p>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href="/sidepanel">Open SidePanel Interface</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
                <DropdownMenuItem>About</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Built with Tailwind v4 and shadcn/ui</p>
        </CardFooter>
      </Card>
    </main>
  );
}
