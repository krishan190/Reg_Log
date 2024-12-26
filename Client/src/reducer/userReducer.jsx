export const userReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_USERS":
        return [...action.payload];
  
      case "ADD_USER":
        return [...state, action.payload];
  
      case "UPDATE_USER":
        return state.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
  
      case "DELETE_USER":
        return state.filter((user) => user._id !== action.payload);
  
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };
  