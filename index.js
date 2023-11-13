const { graphqlHandler, graphqlError } = require('graphql-serverless')
const { makeExecutableSchema } = require('graphql-tools') 
const { app } = require('webfunc')

const itemMocks = [
  { id: 1, name: 'Knock Bits', quantity: 88, price: 12.67, supplier_id: 1 },
  { id: 2, name: 'Widgets', quantity: 10, price: 35.50, supplier_id: 3 }
];

const supplierMocks = [
  { id: 1, name: 'Supplier Calgary', address: '123 gta St' },
  { id: 2, name: 'Supplier Toronto', address: '4526 On St' }
];

const schema = `
  type Item {
    id: ID!
    name: String!
    quantity: Int
    price: Float
    supplier_id: Int
  }

  type Supplier {
    id: ID!
    name: String!
    address: String!
  }

  type Query {
    itemsById(id: Int): Item
    suppliersById(id: Int): Supplier
    items: [Item]!
     searchItemsByName(name: String!): [Item]!
  }

  type Mutation {
    addItem(name: String!, quantity: Int, price: Float, supplier_id: Int): I>
  }
`;

const itemResolver = {
  Query: {
    itemsById(root, { id }, context) {
      const results = id ? itemMocks.filter(p => p.id == id) : itemMocks;
      if (results.length > 0) {
        return results.pop();
      } else {
        throw graphqlError(404, `Item with id ${id} does not exist.`);
      }
    },
    items(root, args, context) {
      return itemMocks;
    },
    searchItemsByName(root, { name }, context) {
      return itemMocks.filter(item => item.name.toLowerCase().includes(name.>
    },
    suppliersById(root, { id }, context) {
      const supplier = supplierMocks.find(supplier => supplier.id === id);
      if (supplier) {
        return supplier;
      } else {
        throw graphqlError(404, `Supplier with id ${id} does not exist.`);
      }
    },
},
  Mutation: {
    addItem(root, { name, quantity, price, supplier_id }, context) {
      const newItem = {
        id: itemMocks.length + 1,
        name,
        quantity,
        price,
        supplier_id,
      };

      itemMocks.push(newItem);
      return newItem;
    },
  },
};

const supplierResolver = {};

const resolvers = {
 ... itemResolver,
 ... supplierResolver,
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers,
});

const graphqlOptions = {
  schema: executableSchema,
  graphiql: { 
    endpoint: '/graphiql' 
  },
  context: {
  	someVar: 'This variable is passed in the "context" object in each resolver.'
  }
}

app.all(['/','/graphiql'], graphqlHandler(graphqlOptions))

eval(app.listen('app', 4000))
