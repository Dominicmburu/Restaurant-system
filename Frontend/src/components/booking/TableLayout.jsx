import React from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';

const TableLayout = ({ selectedDate, selectedTime, guestCount, selectedTable, tables, onTableSelect }) => {
  const isTableSelected = (tableId) => selectedTable === tableId;

  // Group tables by capacity for better display
  const groupedTables = tables.reduce((acc, table) => {
    if (!acc[table.capacity]) {
      acc[table.capacity] = [];
    }
    acc[table.capacity].push(table);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedTables).sort((a, b) => a - b).map((capacity) => (
        <div key={capacity} className="mb-3">
          <h6 className="mb-2">Tables for {capacity} guests:</h6>
          <Row>
            {groupedTables[capacity].map((table) => {
              const available = table.isAvailable && table.capacity >= guestCount;
              const selected = isTableSelected(table.id);

              return (
                <Col xs={4} key={table.id} className="mb-2">
                  <Button
                    variant={selected ? 'primary' : available ? 'outline-success' : 'outline-secondary'}
                    disabled={!available}
                    onClick={() => onTableSelect(selected ? null : table.id)}
                    className="w-100 position-relative"
                    style={{ height: '60px' }}
                  >
                    <div>
                      Table {table.tableNumber}
                      {selected && (
                        <Badge bg="warning" className="position-absolute top-0 end-0">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </Button>
                </Col>
              );
            })}
          </Row>
        </div>
      ))}
      {!selectedTable && selectedTime && (
        <div className="text-center text-muted mt-2">
          Please select a table to complete your booking
        </div>
      )}
    </div>
  );
};

export default TableLayout;