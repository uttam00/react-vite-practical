import { DeleteOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Checkbox, Col, List, Row } from "antd";
import React, { useState } from "react";
import "./App.css";

interface Recipient {
  email: string;
  isSelected: boolean;
}

const initialRecipients: Recipient[] = [
  { email: "ann@timescale.com", isSelected: false },
  { email: "bob@timescale.com", isSelected: false },
  { email: "brian@qwerty.com", isSelected: true },
  { email: "james@qwerty.com", isSelected: false },
  { email: "jane@awesome.com", isSelected: false },
  { email: "kate@qwerty.com", isSelected: true },
  { email: "mike@hello.com", isSelected: true },
];

const groupByDomain = (
  recipients: Recipient[]
): Record<string, Recipient[]> => {
  const domainMap: Record<string, Recipient[]> = {};
  recipients.forEach((recipient) => {
    const domain = recipient.email.split("@")[1];
    if (!domainMap[domain]) {
      domainMap[domain] = [];
    }
    domainMap[domain].push(recipient);
  });
  return domainMap;
};

const App: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
  const [searchValue, setSearchValue] = useState("");

  const filteredRecipients = searchValue
    ? recipients.filter((r) =>
        r.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    : recipients;

  const updateRecipients = (
    condition: (r: Recipient) => boolean,
    update: (r: Recipient) => Recipient
  ) => {
    setRecipients((prev) => prev.map((r) => (condition(r) ? update(r) : r)));
  };

  const handleSelect = (email: string) => {
    updateRecipients(
      (r) => r.email === email,
      (r) => ({ ...r, isSelected: !r.isSelected })
    );
  };

  const handleDomainSelect = (domain: string) => {
    updateRecipients(
      (r) => r.email.endsWith(`@${domain}`),
      (r) => ({ ...r, isSelected: true })
    );
  };

  const handleRemove = (email: string) => {
    updateRecipients(
      (r) => r.email === email,
      (r) => ({ ...r, isSelected: false })
    );
  };

  const handleClearAll = () => {
    setRecipients((prev) => prev.map((r) => ({ ...r, isSelected: false })));
  };

  const groupedRecipients = groupByDomain(recipients);

  return (
    <div className="container">
      <h2>Email Manager</h2>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="left-panel">
          <List
            header={
              <div>
                <b>Available Recipients</b>
                <AutoComplete
                  style={{ width: "100%", marginTop: "8px" }}
                  options={filteredRecipients
                    .filter((r) => !r.isSelected)
                    .map((r) => ({ value: r.email }))}
                  placeholder="Search or enter email"
                  onSearch={(value) => setSearchValue(value)}
                  onSelect={(value) => {
                    setSearchValue("");
                    handleSelect(value);
                  }}
                />
              </div>
            }
            bordered
            dataSource={Object.keys(groupedRecipients)}
            renderItem={(domain) => (
              <List.Item>
                <Checkbox
                  checked={groupedRecipients[domain].every((r) => r.isSelected)}
                  onChange={() => handleDomainSelect(domain)}
                >
                  {domain}
                </Checkbox>
                <List
                  dataSource={groupedRecipients[domain]}
                  renderItem={(item) => (
                    <List.Item>
                      <Checkbox
                        checked={item.isSelected}
                        onChange={() => handleSelect(item.email)}
                      >
                        {item.email}
                      </Checkbox>
                    </List.Item>
                  )}
                />
              </List.Item>
            )}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="right-panel">
          <List
            header={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <b>Selected Recipients</b>
                <Button type="link" onClick={handleClearAll} danger>
                  Clear All
                </Button>
              </div>
            }
            bordered
            dataSource={Object.keys(groupedRecipients).filter((domain) =>
              groupedRecipients[domain].some((r) => r.isSelected)
            )}
            renderItem={(domain) => (
              <List.Item>
                <b>{domain}</b>
                <List
                  dataSource={groupedRecipients[domain].filter(
                    (r) => r.isSelected
                  )}
                  renderItem={(item) => (
                    <List.Item>
                      {item.email}
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleRemove(item.email)}
                      />
                    </List.Item>
                  )}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default App;
