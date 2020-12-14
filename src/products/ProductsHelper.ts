import { ProductPropertyDto } from './dto/product-property.dto';
import { Product } from './product.entity';

export class ProductsHelper {
  static productPropertiesToObjects(
    product: Product,
  ): { [key: string]: string }[] {
    const props = product.property.map((prop) => ({
      [prop.name.trim()]: prop.value,
    }));
    return props;
  }

  static generateProductPropertyObjectsFromCsv(
    propertyArray,
  ): ProductPropertyDto[] {
    return propertyArray.reduce(
      (acc, curr) => [...acc, { ['name']: curr[0], ['value']: curr[1] }],
      [],
    );
  }

  static propertyCsvToArray(property) {
    return property.split(',').map((el: string) => el.split(':'));
  }
}
