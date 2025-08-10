import AddAccountingTransaction from '../../_components/dashboard/accounting/AddAccountingTransaction'
import AccountingTransaction from '../../_components/dashboard/accounting/AccountingTransaction'
import React from 'react'


export default function page() {
  return (
    <div>
        <AccountingTransaction/>
        <AddAccountingTransaction/>
        
    </div>
  )
}
