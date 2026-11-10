import React, { createContext, useContext } from 'react';
import { cn } from '@cci/admin-ui';

const TableDensity = createContext(false);

export function DataTable({ label, columns, compact = false, children, emptyState }) {
  return (
    <TableDensity.Provider value={compact}>
      <div className="tw-overflow-x-auto" data-slot="data-table">
        <table
          aria-label={label}
          className={cn(
            'tw-w-full tw-border-collapse',
            compact ? 'tw-table-fixed' : 'tw-min-w-[760px]',
          )}
        >
          <thead className="tw-bg-cci-wpc-surfaceSoft">
            <tr>
              {columns.map(
                ({ id, label: heading, className, sortable, sortDirection, sortIcon, onSort }) => (
                  <th
                    key={id}
                    scope="col"
                    aria-sort={sortable ? sortDirection || 'none' : undefined}
                    className={cn(
                      'tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-py-3 tw-text-left tw-text-xs tw-font-bold tw-uppercase tw-text-cci-wpc-muted',
                      compact ? 'tw-break-words tw-px-2 sm:tw-px-4' : 'tw-px-4',
                      className,
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={onSort}
                        className="tw-inline-flex tw-cursor-pointer tw-items-center tw-gap-1.5 tw-border-0 tw-bg-transparent tw-p-0 tw-text-xs tw-font-bold tw-uppercase tw-text-cci-wpc-muted hover:tw-text-cci-wpc-brandStrong focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-cci-wpc-brand"
                      >
                        <span>{heading}</span>
                        <span className="tw-text-[10px]" aria-hidden="true">
                          {sortIcon || '↕'}
                        </span>
                      </button>
                    ) : (
                      heading
                    )}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        {emptyState}
      </div>
    </TableDensity.Provider>
  );
}

export function TableRow({ children }) {
  return (
    <tr className="tw-group tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border last:tw-border-b-0">
      {children}
    </tr>
  );
}

export function TableCell({ children, className, ...props }) {
  const compact = useContext(TableDensity);
  return (
    <td
      {...props}
      className={cn(
        'tw-align-middle tw-text-sm tw-text-cci-wpc-text',
        compact ? 'tw-break-words tw-px-2 tw-py-3 sm:tw-px-4' : 'tw-px-4 tw-py-4',
        className,
      )}
    >
      {children}
    </td>
  );
}

export function RowPrimary({ href, label, description, actions, actionsLabel }) {
  return (
    <>
      <a
        href={href}
        className="tw-font-semibold tw-text-cci-wpc-text tw-no-underline visited:tw-text-cci-wpc-text hover:tw-text-cci-wpc-brandStrong hover:tw-underline focus-visible:tw-underline"
      >
        {label}
      </a>
      {description && (
        <div className="tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">{description}</div>
      )}
      {actions && (
        <div
          aria-label={actionsLabel}
          className="tw-mt-1 tw-flex tw-flex-wrap tw-items-center tw-leading-5 tw-opacity-100 tw-transition-opacity md:tw-opacity-0 md:group-hover:tw-opacity-100 md:group-focus-within:tw-opacity-100"
        >
          {actions}
        </div>
      )}
    </>
  );
}

export function RowAction({ href, tone, separator, children, ...props }) {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      {...props}
      {...(href ? { href } : { type: 'button' })}
      className={cn(
        'tw-inline-flex tw-cursor-pointer tw-border-0 tw-bg-transparent tw-p-0 tw-text-[13px] tw-font-medium tw-no-underline hover:tw-underline focus-visible:tw-underline',
        tone === 'danger'
          ? 'tw-text-cci-wpc-danger hover:tw-text-cci-wpc-dangerText'
          : 'tw-text-cci-wpc-brand hover:tw-text-cci-wpc-brandStrong',
        separator && 'after:tw-mx-2 after:tw-text-cci-wpc-borderStrong after:tw-content-["|"]',
      )}
    >
      {children}
    </Component>
  );
}
