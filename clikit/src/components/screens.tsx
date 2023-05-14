import React from 'react';
import { Text } from 'ink';

export const JsonValue: React.FC<{ value: any }> = ({ value }) => {
  return <Text>JSON: {JSON.stringify(value)}</Text>;
};

export const StringValue: React.FC<{ value: any }> = ({ value }) => {
  return <Text>{value?.toString()}</Text>;
};

export const Empty: React.FC = () => {
  return <Text>Empty</Text>;
};

export const Failure: React.FC<{ error: any }> = ({ error }) => {
  return <Text>{error?.toString()}</Text>;
};