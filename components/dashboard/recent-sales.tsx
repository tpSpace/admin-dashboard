import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RecentSale } from "@/types/dashboard"

interface RecentSalesProps {
  sales?: RecentSale[];
}

const defaultSales: RecentSale[] = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: 1999.00,
    avatarUrl: "/avatars/01.png"
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: 39.00,
    avatarUrl: "/avatars/02.png"
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: 299.00,
    avatarUrl: "/avatars/03.png"
  },
  {
    id: "4",
    name: "William Kim",
    email: "will@email.com",
    amount: 99.00,
    avatarUrl: "/avatars/04.png"
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: 39.00,
    avatarUrl: "/avatars/05.png"
  }
]

export function RecentSales({ sales = defaultSales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatarUrl} alt={`${sale.name}'s avatar`} />
            <AvatarFallback>
              {sale.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${sale.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
} 