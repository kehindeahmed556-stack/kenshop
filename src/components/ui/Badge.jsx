import clsx from 'clsx'
import { CONDITION_COLORS } from '../../lib/constants'

export function ConditionBadge({ condition }) {
  const labels = { new: 'New', like_new: 'Like New', used: 'Used', for_parts: 'For Parts' }
  return (
    <span className={clsx('badge', CONDITION_COLORS[condition] || 'bg-gray-100 text-gray-700')}>
      {labels[condition] || condition}
    </span>
  )
}

export function StatusBadge({ status }) {
  const styles = {
    active:   'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    sold:     'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    draft:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pending:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    confirmed:'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    shipped:  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    delivered:'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled:'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }
  return (
    <span className={clsx('badge capitalize', styles[status] || 'bg-gray-100 text-gray-700')}>
      {status}
    </span>
  )
}
