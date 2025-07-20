import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon?: React.ReactNode
}

export default function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = change.startsWith('+')
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-gray-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className={`text-xs flex items-center mt-1 ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
