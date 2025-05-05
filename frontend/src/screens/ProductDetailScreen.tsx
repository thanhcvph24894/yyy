import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types/navigation';
import { productService, cartService } from '../services';
import { formatCurrency } from '../utils';
import CustomHeader from '../components/CustomHeader';

type Comment = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
};

type ProductWithDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  sizes: string[];
  colors: string[];
  relatedProducts: any[];
  comments: Comment[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ navigation, route }: Props) => {
  const { productSlug } = route.params;
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productSlug]);

  const fetchProductDetails = async () => {
    console.log('Fetching product details for slug:', productSlug);
    setLoading(true);
    try {
      const response = await productService.getProductDetail(productSlug);
      if (response.success && response.data) {
        const productData = response.data as unknown as Product;
        setProductDetails(productData);
        
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } else {
        console.error('Lỗi lấy thông tin sản phẩm:', response.message);
        Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi lấy thông tin sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!productDetails) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin sản phẩm');
      return;
    }

    const hasColors = productDetails.colors && productDetails.colors.length > 0;
    const hasSizes = productDetails.sizes && productDetails.sizes.length > 0;

    // Kiểm tra nếu sản phẩm có màu nhưng chưa chọn
    if (hasColors && !selectedColor) {
      Alert.alert('Thông báo', 'Vui lòng chọn màu sắc');
      return;
    }

    // Kiểm tra nếu sản phẩm có kích thước nhưng chưa chọn
    if (hasSizes && !selectedSize) {
      Alert.alert('Thông báo', 'Vui lòng chọn kích thước');
      return;
    }

    // Tạo biến thể (nếu cần)
    const variant = (hasColors || hasSizes) ? {
      color: selectedColor,
      size: selectedSize
    } : undefined;

    try {
      setAddingToCart(true);
      const response = await cartService.addToCart(
        productDetails._id,
        quantity,
        variant
      );

      // Kiểm tra lỗi unauthorized
      if (response.unauthorizedError) {
        Alert.alert(
          'Thông báo',
          'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
          [
            {
              text: 'Hủy',
              style: 'cancel'
            },
            {
              text: 'Đăng nhập',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
        return;
      }

      if (response.success) {
        Alert.alert(
          'Thành công',
          'Đã thêm sản phẩm vào giỏ hàng',
          [
            {
              text: 'Tiếp tục mua sắm',
              style: 'cancel',
            },
            {
              text: 'Xem giỏ hàng',
              onPress: () => navigation.navigate('Cart'),
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  const renderColorOption = ({ item }: { item: string }) => {
    // Xác định màu của icon dựa trên độ sáng của màu nền
    const isLightColor = item.toLowerCase() === 'trắng' || item.toLowerCase() === 'white';
    const checkmarkColor = isLightColor ? '#000' : '#fff';

    return (
      <TouchableOpacity
        style={[
          styles.colorOptionContainer,
          selectedColor === item && styles.selectedColorContainer,
        ]}
        onPress={() => setSelectedColor(item)}
      >
        <View
          style={[
            styles.colorOption,
            { 
              backgroundColor: item.toLowerCase() === 'trắng' ? '#ffffff' : 
                              item.toLowerCase() === 'đen' ? '#000000' : 
                              item.toLowerCase() === 'xám' ? '#888888' : 
                              item.toLowerCase() === 'xanh' ? '#0000FF' : 
                              item.toLowerCase() === 'tím' ? '#800080' : 
                              item.toLowerCase() === 'cam' ? '#FFA500' : 
                              item.toLowerCase() === 'hồng' ? '#FFC0CB' : 
                              item.toLowerCase() === 'nâu' ? '#A52A2A' : 
                              item.toLowerCase() === 'bạc' ? '#C0C0C0' : 
                              item.toLowerCase() === 'xanh lá' ? '#008000' : 
                              item.toLowerCase() === 'xanh dương' ? '#0000FF' : 
                              item.toLowerCase() === 'xanh lơ' ? '#00FFFF' : 
                              item.toLowerCase() === 'xanh nước biển' ? '#00BFFF' : 
                              item.toLowerCase() === 'xanh lá cây' ? '#008000' :
                              item.toLowerCase() === 'hồng nhạt' ? '#FFB6C1' : 
                              item.toLowerCase() 

            },
          ]}
        >
          {selectedColor === item && (
            <Icon name="checkmark" size={16} color={checkmarkColor} />
          )}
        </View>
        <Text style={[
          styles.colorText, 
          selectedColor === item && styles.selectedColorText
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSizeOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.sizeOption,
        selectedSize === item && styles.selectedSizeOption,
      ]}
      onPress={() => setSelectedSize(item)}
    >
      <Text
        style={[
          styles.sizeText,
          selectedSize === item && styles.selectedSizeText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!productDetails) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title={productDetails.name} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hình ảnh sản phẩm */}
        <Image
          source={{ uri: productDetails.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Thông tin sản phẩm */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productDetails.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {formatCurrency(productDetails.salePrice || productDetails.price)}
            </Text>
            {productDetails.salePrice && (
              <Text style={styles.originalPrice}>
                {formatCurrency(productDetails.price)}
              </Text>
            )}
          </View>

          {/* Đánh giá */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Icon
                  key={`star-${index}`}
                  name={
                    index < Math.floor(productDetails.averageRating)
                      ? 'star'
                      : index < productDetails.averageRating
                      ? 'star-half'
                      : 'star-outline'
                  }
                  size={18}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {productDetails.averageRating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Chọn màu sắc */}
        {productDetails.colors && productDetails.colors.length > 0 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionTitle}>Màu sắc:</Text>
            <FlatList
              data={productDetails.colors}
              renderItem={renderColorOption}
              keyExtractor={(item) => `color-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        )}

        {/* Chọn kích thước */}
        {productDetails.sizes && productDetails.sizes.length > 0 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionTitle}>Kích thước:</Text>
            <FlatList
              data={productDetails.sizes}
              renderItem={renderSizeOption}
              keyExtractor={(item) => `size-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        )}

        {/* Mô tả sản phẩm */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>{productDetails.description}</Text>
        </View>
      </ScrollView>

      {/* Thanh công cụ dưới */}
      <View style={styles.bottomToolbar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Icon name="remove" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <Icon name="add" size={22} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon name="cart-outline" size={22} color="#fff" />
              <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productImage: {
    width: '100%',
    height: 400,
  },
  productInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  optionsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsList: {
    paddingVertical: 8,
  },
  colorOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedColorContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  colorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  selectedColorText: {
    fontWeight: 'bold',
  },
  sizeOption: {
    minWidth: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 12,
  },
  selectedSizeOption: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#fff',
  },
  descriptionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 16,
  },
  quantityButton: {
    padding: 10,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen; 